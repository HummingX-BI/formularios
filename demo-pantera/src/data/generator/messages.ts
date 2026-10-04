import type { MessageThread, Prospect, NotificationLog } from '../types';
import type { RandomGenerator } from '../rng';

export function generateMessages(rng: RandomGenerator, prospects: Prospect[]) {
  const threads: MessageThread[] = [];

  // Get prospects that used 'mensajeria'
  const msjProspects = prospects.filter((p) => p.channel === 'mensajeria');

  // Select at least 40
  const selectedProspects = rng.sample(
    msjProspects,
    Math.max(40, Math.floor(msjProspects.length * 0.1)),
  );

  let threadSeq = 1;
  const cutoff90DaysAgo = '2026-07-02'; // From prompt 8

  for (const p of selectedProspects) {
    const isRecent = p.date >= cutoff90DaysAgo;
    // Agent handles ~60% in last 90 days, human handles 40%
    const handledByBot = isRecent ? rng.bool(0.6) : false;

    let firstResponseMin = 0;
    if (handledByBot) {
      firstResponseMin = rng.float(0, 1); // < 1 minute
    } else {
      firstResponseMin = Math.round(rng.logNormal(Math.log(3.2 * 60), 0.5)); // human average 3.2 hours
    }

    // Some scripted deterministic threads for realism
    const scriptType = rng.choice([
      'horarios',
      'precios',
      'clase_muestra',
      'ubicacion',
      'hermanos',
    ]);

    const messages: { sender: 'user' | 'agent' | 'human'; text: string; timestamp: string }[] = [];

    const startTime = new Date(p.date + 'T10:00:00Z');
    const msgTime = new Date(startTime);

    // User initial msg
    let initialText = '';
    if (scriptType === 'horarios')
      initialText =
        'Hola, me podrían dar información de horarios para un niño de ' + p.childAge + ' años?';
    if (scriptType === 'precios') initialText = 'Buenas tardes, ¿qué precio tienen las clases?';
    if (scriptType === 'clase_muestra')
      initialText = 'Hola! Quiero agendar una clase muestra para mi hija.';
    if (scriptType === 'ubicacion') initialText = '¿Dónde están ubicados? ¿Tienen estacionamiento?';
    if (scriptType === 'hermanos')
      initialText = 'Hola, tengo 2 niños, ¿manejan algún descuento por hermanos?';

    messages.push({ sender: 'user', text: initialText, timestamp: msgTime.toISOString() });

    // Response
    msgTime.setUTCMinutes(msgTime.getUTCMinutes() + firstResponseMin);
    const responder = handledByBot ? 'agent' : 'human';

    let respText = '';
    if (scriptType === 'horarios')
      respText =
        '¡Hola! Claro que sí. Para niños de esa edad, tenemos grupos de lunes a viernes entre las 4:00 PM y 7:00 PM, y sábados por la mañana. ¿Qué día les conviene más?';
    if (scriptType === 'precios')
      respText =
        '¡Buenas tardes! Manejamos mensualidades desde $1,350 tomando una clase a la semana, hasta $2,750 por tres clases semanales. Además, la inscripción anual es de $1,200. ¿Les gustaría conocer las instalaciones?';
    if (scriptType === 'clase_muestra')
      respText =
        '¡Hola! Con mucho gusto. Las clases muestra no tienen costo y duran 45 minutos. Necesitarán traer traje de baño, gorra y goggles. ¿Para qué día les gustaría agendarla?';
    if (scriptType === 'ubicacion')
      respText =
        '¡Hola! Estamos en el corazón de Lindavista, muy cerca del parque. Contamos con estacionamiento propio gratuito para nuestros clientes durante la clase. ¿Gusta que le envíe la ubicación de Google Maps?';
    if (scriptType === 'hermanos')
      respText =
        '¡Hola! Sí, claro. A partir de 2 hermanos les otorgamos un 10% de descuento en la mensualidad, y si son 3 o más el descuento sube al 15%. ¿Qué edades tienen los pequeños?';

    messages.push({ sender: responder, text: respText, timestamp: msgTime.toISOString() });

    // Add a few more generic follow-ups to pad to 6-14 msgs
    const numFollowUps = rng.int(2, 6);
    for (let i = 0; i < numFollowUps; i++) {
      msgTime.setUTCMinutes(msgTime.getUTCMinutes() + rng.int(2, 60));
      messages.push({
        sender: 'user',
        text: rng.choice([
          'Excelente, gracias',
          'Me parece bien',
          '¿Y qué necesitan llevar?',
          'Perfecto, confirmo más tarde',
          'Gracias por la info',
        ]),
        timestamp: msgTime.toISOString(),
      });
      msgTime.setUTCMinutes(
        msgTime.getUTCMinutes() + (handledByBot ? rng.float(0, 1) : rng.int(5, 30)),
      );
      messages.push({
        sender: responder,
        text: rng.choice([
          'Estamos a sus órdenes',
          '¡Los esperamos!',
          'Por supuesto, cualquier duda me avisa',
          'Con gusto. ¡Excelente día!',
        ]),
        timestamp: msgTime.toISOString(),
      });
    }

    let result: MessageThread['result'] = 'abierto';
    if (p.stage === 'clase_muestra') result = 'clase_muestra';
    else if (p.stage === 'visita_agendada') result = 'visita';
    else if (p.stage === 'perdido' && p.lostReason === 'precio') result = 'pierde_precio';
    else if (p.stage === 'perdido' && p.lostReason === 'horario') result = 'pierde_horario';

    threads.push({
      id: 'MSG_' + threadSeq++,
      prospectId: p.id,
      date: p.date,
      topic: scriptType,
      sentiment: rng.choice(['positive', 'neutral']),
      handledByBot,
      firstResponseMin,
      result,
      messages,
    });
  }

  const notifications: NotificationLog[] = [];
  // Just generate some dummy notifications

  return { threads, notifications };
}

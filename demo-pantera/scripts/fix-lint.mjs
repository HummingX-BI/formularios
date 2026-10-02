import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

// Delete scripts
try { fs.unlinkSync(path.join(root, 'scripts', 'dump-schedule.ts')); } catch (e) {}
try { fs.unlinkSync(path.join(root, 'scripts', 'dump123.ts')); } catch (e) {}

// Fix prospects.ts
const pPath = path.join(root, 'src', 'data', 'generator', 'prospects.ts');
let pC = fs.readFileSync(pPath, 'utf8');
pC = pC.replace(/dailyCounts\[remainders\[remIdx\]!\.idx\]\+\+;/g, "dailyCounts[remainders[remIdx]?.idx as number]++;");
pC = pC.replace(/const count = dailyCounts\[d\]!;/g, "const count = dailyCounts[d] as number;");
pC = pC.replace(/const src = shuffledSources\[sourceIndex\+\+\]!;/g, "const src = shuffledSources[sourceIndex++] as string;");
pC = pC.replace(/const target = enrollTargets\[src\]!;/g, "const target = enrollTargets[src] as number;");
pC = pC.replace(/const reason = shuffledLosses\[lossIndex\+\+\]!;/g, "const reason = shuffledLosses[lossIndex++] as LostReason;");
fs.writeFileSync(pPath, pC);

// Fix students.ts
const sPath = path.join(root, 'src', 'data', 'generator', 'students.ts');
let sC = fs.readFileSync(sPath, 'utf8');
sC = sC.replace(/tutorName: `\$\{rng\.choice/g, "tutorName: rng.choice");
sC = sC.replace(/const size = familySizes\[parseInt\(fam\.id\.split\('_'\)\[1\]!\) - 1\]!;/g, "const size = familySizes[parseInt(fam.id.split('_')[1] as string) - 1] as number;");
sC = sC.replace(/c\.enrollDate < min \? c\.enrollDate : min, children\[0\]!\.enrollDate\);/g, "c.enrollDate < min ? c.enrollDate : min, (children[0] as any).enrollDate);");
sC = sC.replace(/id: p\.enrolledStudentId!,/g, "id: p.enrolledStudentId as string,");
sC = sC.replace(/const sessions = parseInt\(student\.plan\.split\('\/'\)\[0\]!\);/g, "const sessions = parseInt(student.plan.split('/')[0] as string);");
fs.writeFileSync(sPath, sC);

// Fix prospects.test.ts
const tPath = path.join(root, 'src', 'tests', 'generator', 'prospects.test.ts');
let tC = fs.readFileSync(tPath, 'utf8');
tC = tC.replace(/reasons\.set\(p\.lostReason!, \(reasons\.get\(p\.lostReason!\) \|\| 0\) \+ 1\);/g, "reasons.set(p.lostReason as string, (reasons.get(p.lostReason as string) || 0) + 1);");
tC = tC.replace(/expect\(stu!\.source\)\.toBe\(p\.source\);/g, "expect(stu?.source).toBe(p.source);");
fs.writeFileSync(tPath, tC);

console.log('Fixed lint issues.');

interface FightingOptions {
  hp: number;
  power: number;
  rampancy: number;
  endurance: number;
  delta: number;
}
export function* fight(options: FightingOptions) {
  let ratio = 0.5;
  let t = 0;
  let hp = options.hp;
  let endurance = 0;
  const T = options.delta / 1000;
  let damage = 0;
  while (endurance < options.endurance && hp > 0) {
    const isPulling: boolean = yield {
      ratio,
      hp,
      endurance,
      damage,
    };
    t += Math.random() * options.rampancy + T;
    damage = (Math.sin(t) + 1) * options.power * T;
    if (isPulling) {
      ratio += damage;
      hp -= damage;
    } else {
      ratio -= damage;
    }
    ratio = Math.max(0, Math.min(1, ratio));
    if (ratio <= 0 || ratio >= 1) {
      endurance += T;
      endurance = Math.min(options.endurance, endurance);
    } else {
      endurance -= T;
      endurance = Math.max(0, endurance);
    }
    hp -= T;
  }
  return { ratio, hp: Math.max(0, hp), endurance, damage };
}

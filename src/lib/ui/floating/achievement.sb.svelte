<script lang="ts">
  import Achievement from "./achievement.svelte";

  let achievements = $state<
    {
      id: string;
      name: string;
      condition: string;
      reward: { type: "tokens"; quantity: number };
      isHidden: boolean;
    }[]
  >([]);
</script>

<button
  onclick={() => {
    for (let i = 0; i < 5; i++) {
      achievements.push({
        id: crypto.randomUUID(),
        name: "이제 시작" + String(Math.random()).slice(0, 4),
        condition: "물고기 10마리 낚기",
        reward: { type: "tokens", quantity: 10 },
        isHidden: Math.random() < 0.5,
      });
    }
  }}>트리거</button
>

{#each achievements as achievement (achievement.id)}
  <Achievement
    {...achievement}
    onclose={() => {
      achievements = achievements.filter((x) => x.id !== achievement.id);
    }}
  />
{/each}

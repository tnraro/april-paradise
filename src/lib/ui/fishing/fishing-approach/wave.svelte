<script lang="ts">
  interface Props {
    t: number;
    speed: number;
    amplitude: number;
    wavelength: number;
    offsetX?: number;
  }
  let {
    t,
    speed,
    amplitude,
    wavelength,
    offsetX = 0,
  }: Props = $props();
  let hw = $derived(wavelength / 2);
  let base = $derived(
    -(((speed * (t / 1000) + offsetX) % wavelength) * 2) - 50,
  );
  let a = $derived(
    Math.sin(((speed / 180) * Math.PI * 10 * t + offsetX) / 1000) * amplitude,
  );
</script>

<path
  class="wave"
  d="
  M {base} {-a}
  C {base + hw} {-a}
    {base + hw} {a}
    {base + hw * 2} {a}
  C {base + hw * 3} {a}
    {base + hw * 3} {-a}
    {base + hw * 4} {-a}
  C {base + hw * 5} {-a}
    {base + hw * 5} {a}
    {base + hw * 6} {a}
  C {base + hw * 7} {a}
    {base + hw * 7} {-a}
    {base + hw * 8} {-a}
  L {base + hw * 8} 1000
  L {base} 1000
  z
"
/>

<style>
  .wave {
    fill: #33cbdc80;
  }
</style>

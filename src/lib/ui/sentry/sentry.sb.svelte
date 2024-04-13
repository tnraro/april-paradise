<script lang="ts">
  interface Props {
    message: string;
  }
  let { message }: Props = $props();
</script>

<button
  onclick={() => {
    throw new Error(message);
  }}>에러</button
>

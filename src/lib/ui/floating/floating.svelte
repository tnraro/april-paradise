<script lang="ts">
  import Alert from "./alert.svelte";
  import Dialog from "./dialog.svelte";
  import Drawer from "./drawer.svelte";

  const enum FloatingType {
    Alert,
    Dialog,
    Drawer,
  }
  const open = () => {
    isOpen = true;
  };
  const close = () => {
    isOpen = false;
  };
  interface Props {
    type: FloatingType;
  }
  let { type }: Props = $props();

  let isOpen = $state(false);
</script>

<button onclick={open}>trigger</button>

{#if type === FloatingType.Alert}
  {#if isOpen}
    <Alert>
      <span>Alert</span>
      <button onclick={close}>close</button>
    </Alert>
  {/if}
{:else if type === FloatingType.Dialog}
  {#if isOpen}
    <Dialog onclose={close}>Dialog</Dialog>
  {/if}
{:else if type === FloatingType.Drawer}
  {#if isOpen}
    <Drawer onclose={close}>Drawer</Drawer>
  {/if}
{/if}

<script>
	import { BluetoothConnected, Dot } from 'lucide-svelte';
</script>

<div class="flex items-center justify-between w-full h-auto p-4 rounded-2xl border-blue-900 bg-white">
	<div class="flex items-center justify-between w-auto min-w-32">
		<BluetoothConnected />
		<p>00:11:22:FF:EE</p>
	</div>
	<Dot />
</div>
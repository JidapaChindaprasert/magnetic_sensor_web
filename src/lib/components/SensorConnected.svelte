<script>
	import { BluetoothConnected, Dot } from 'lucide-svelte';
</script>

<div class="flex items-center justify-between w-full h-auto p-4 rounded-2xl border border-sky-500 bg-sky-200">
	<div class="flex items-center justify-between w-auto min-w-32">
		<BluetoothConnected class="text-blue-500"/>
		<p>00:11:22:FF:EE</p>
	</div>
	<Dot class="text-green-500" />
</div>
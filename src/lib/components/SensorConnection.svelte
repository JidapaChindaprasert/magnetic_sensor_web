<script>
	import { BluetoothSearching, Info, Link2 } from 'lucide-svelte';
</script>

<div class="flex items-center justify-between w-full h-auto p-4 rounded-2xl border-blue-900 bg-white">
	<div class="flex items-center justify-between w-auto min-w-32">
		<BluetoothSearching class="text-blue-500"/>
		<p>00:11:22:FF:EE</p>
	</div>
	<div class="flex items-center justify-between w-auto min-w-16">
		<Link2 />
		<Info />
	</div>
</div>
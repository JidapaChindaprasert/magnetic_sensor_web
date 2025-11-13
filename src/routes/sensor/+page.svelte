<script>
	import { ArrowBigRight } from 'lucide-svelte';
	import SensorConnection from '$lib/components/SensorConnection.svelte';
	import SensorConnected from '$lib/components/SensorConnected.svelte';
</script>


<div class="flex flex-1 flex-col items-center justify-items-start gap-4 sm:gap-4 md:gap-8 h-auto p-4 pb-16 sm:px-4 md:px-8 lg:px-12 xl:px-16 bg-sky-100">
	<div class="flex flex-col gap-2 md:gap-4 w-full">
		<p>ตั้งค่าการเชื่อมต่อ</p>
		<div class="flex items-center justify-between w-full h-auto p-4 rounded-2xl border-blue-900 bg-white">
			<p>ไปที่การเชื่อมต่อ</p>
			<ArrowBigRight />
		</div>
	</div>
	<div class="flex flex-col gap-2 md:gap-4 w-full">
		<p>อุปกรณ์ที่เชื่อมต่ออยู่</p>
		<SensorConnected />
	</div>
	<div class="flex flex-col w-full gap-2 md:gap-4">
		<p>อุปกรณ์ใกล้เคียง</p>
		<SensorConnection />
		<SensorConnection />
		<SensorConnection />
		<SensorConnection />
		<SensorConnection />
	</div>
</div>


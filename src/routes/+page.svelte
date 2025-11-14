<script>
	import { Radio, BookOpen, SquarePen, BarChart3 } from "lucide-svelte";
</script>

<div
	class="flex flex-col items-center justify-items-start gap-6 sm:gap-6 md:gap-4 h-screen p-6 pb-16 sm:px-4 md:px-8 lg:px-12 xl:px-16 bg-stone-100"
>
	<h3 class="text-responsive bg-stone-100">Phranai App</h3>
	<div
		class="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center align-items-center basis-1/2 w-full flex-shrink"
	>
		<a
			class="flex flex-col justify-center items-center p-1 w-full h-full
		bg-sky-100/80 rounded-2xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-sky-200"
			href="/sensor"
		>
			<Radio />
			<p>เชื่อมต่อเซนเซอร์</p>
		</a>
		<a
			class="flex flex-col justify-center items-center p-1 w-full h-full
		bg-blue-200/70 rounded-2xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			href="/lesson"
		>
			<BookOpen />
			<p>เข้าสู่บทเรียน</p>
		</a>
		<a
			class="flex flex-col justify-center items-center p-1 w-full h-full
		bg-blue-200/70 rounded-2xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			href="/experiment"
		>
			<SquarePen />
			<p>บันทึกข้อมูล</p>
		</a>
		<a
			class="flex flex-col justify-center items-center p-1 w-full h-full
		bg-sky-100/60 rounded-2xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-sky-200"
			href="/graph"
		>
			<BarChart3 />
			<p>วิเคราะห์ข้อมูล</p>
		</a>
	</div>
	<div class="basis-1/4 w-full h-auto min-h-20 bg-red-500">
		<p>sensor</p>
	</div>
	<div class="basis-1/4 w-full h-auto min-h-20 bg-red-500">
		<p>experiment</p>
	</div>
</div>

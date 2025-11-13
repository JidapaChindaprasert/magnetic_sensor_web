<script>
  import { Radio, BookOpen, SquarePen, BarChart3 } from "lucide-svelte";
</script>

<div class = "flex flex-col items-center justify-items-start gap-4 sm:gap-4 md:gap-8 h-screen p-4 pb-16 sm:px-4 md:px-8 lg:px-12 xl:px-16 bg-sky-100 ">
	<h1 class="text-responsive bg-sky-100">Phranai App</h1>
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center align-items-center basis-1/2 w-full flex-shrink bg-red-500">
		<a class="flex flex-col justify-center items-center w-full h-full bg-blue-500" href="/sensor">
			<Radio />
			<p>เชื่อมต่อเซนเซอร์</p>
		</a>
		<a class="flex flex-col justify-center items-center w-full h-full bg-blue-500" href="/lesson">
			<BookOpen />
			<p>เข้าสู่บทเรียน</p>
		</a>
		<a class="flex flex-col justify-center items-center w-full h-full bg-blue-500" href="/experiment">
			<SquarePen />
			<p>บันทึกข้อมูล</p>
		</a>
		<a class="flex flex-col justify-center items-center w-full h-full bg-blue-500" href="/">
			<BarChart3 />
			<p>...</p>
		</a>
	</div>
	<div class="basis-1/4 w-full h-auto min-h-20 bg-red-500">
		<p>sensor</p>
	</div>
	<div class="basis-1/4 w-full h-auto min-h-20 bg-red-500">
		<p>experiment</p>
	</div>
</div>
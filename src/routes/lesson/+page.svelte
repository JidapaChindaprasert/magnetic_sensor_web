<script>
	import SearchBar from "$lib/components/SearchBar.svelte";
	import LessonCard from "$lib/components/LessonCard.svelte";
</script>

<div class="flex flex-col min-h-screen bg-sky-100">
	<div class="flex w-full flex-col basis-1/8 justify-center items-center p-4 sm:px-4 md:px-8 lg:px-12 xl:px-16 bg-white sticky top-0 z-20">
		<h2 class="mb-4">เข้าสู่บทเรียน</h2>
		<SearchBar />
		<div
			class="grid grid-cols-3 gap-4 sm:gap-3 md:gap-5 basis-1/7 w-full flex-shrink"
		>
			<div class="col-span-3 bg-blue-500"></div>
			<div
				class="text-responsive flex flex-col justify-center items-center w-full h-full
		bg-blue-200/70 rounded-xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			>
				รายการโปรด
			</div>
			<div
				class="text-responsive flex flex-col justify-center items-center w-full h-full
		bg-blue-200/70 rounded-xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			>
				<button>กิจกรรมล่าสุด</button>
			</div>
			<div
				class="text-responsive flex flex-col justify-center items-center w-full h-full
		bg-blue-200/70 rounded-xl border-blue-900 shadow-lg
		transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			>
				<button>การบันทึก</button>
			</div>
		</div>
	</div>
	<div
		class="flex flex-col p-4 sm:px-4 gap-2 md:gap-4 md:px-8 lg:px-12 xl:px-16 flex-1 pb-20 min-h-0 overflow-auto bg-transparent"
	>
		<LessonCard />
		<LessonCard />
		<LessonCard />
	</div>
</div>

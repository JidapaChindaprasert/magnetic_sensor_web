<script>
	import SearchBar from "$lib/components/SearchBar.svelte";

	import LessonCard from "$lib/components/LessonCard.svelte";

	import { goto } from "$app/navigation";

	const lessons = [
		{ title: "tutorial", path: "/lesson/lesson-1" },

		{
			title: "การทดลองที่ 1: ความแรงของสนามแม่เหล็ก",

			path: "/lesson/lesson-2",
		},

		{
			title: "การทดลองที่ 2: สนามแม่เหล็กของลวดตรง - สนามแม่เหล็กเปลี่ยนแปลงไปตามระยะห่างจากลวดอย่างไร?",

			path: "/lesson/lesson-3",
		},

		{
			title: "การทดลองที่ 3: สนามแม่เหล็กของลวดตรง - กระแสไฟฟ้าทำให้สนามแม่เหล็กเปลี่ยนแปลงอย่างไร?",

			path: "/lesson/lesson-4",
		},

		{
			title: "การทดลองที่ 4: สนามแม่เหล็กของขดลวด - กระแสไฟฟ้าทำให้สนามแม่เหล็กเปลี่ยนแปลงอย่างไร?",

			path: "/lesson/lesson-5",
		},

		{
			title: "การทดลองที่ 5: สนามแม่เหล็กของขดลวด - จำนวนของขดลวดทำให้สนามแม่เหล็กมีการเปลี่ยนแปลงอย่างไร?",

			path: "/lesson/lesson-6",
		},

		{
			title: "การทดลองที่ 6: แรงที่กระทำต่อลวดตัวนำที่มีกระแสไฟฟ้าในสนามแม่เหล็กภายนอก - กระแสไฟฟ้าทำให้แรงดังกล่าวเปลี่ยนแปลงไปอย่างไร?",

			path: "/lesson/lesson-7",
		},

		{
			title: "การทดลองที่ 7: แรงที่กระทำต่อลวดตัวนำที่มีกระแสไฟฟ้าในสนามแม่เหล็กภายนอก - แรงนี้จะเปลี่ยนแปลงตามความยาวของลวดอย่างไร?",

			path: "/lesson/lesson-8",
		},

		{
			title: "การทดลองที่ 8: แรงที่กระทำต่อลวดตัวนำที่มีกระแสไฟฟ้าในสนามแม่เหล็กภายนอก - สนามแม่เหล็กทำให้แรงดังหล่าวเปลี่ยนแปลงอย่างไร?",

			path: "/lesson/lesson-9",
		},
	];

	let searchTerm = "";

	$: filteredLessons = lessons.filter((lesson) =>
		lesson.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	function handleSearchInput(val) {
		searchTerm = val;
	}

	function handleLessonClick(lessonPath) {
		localStorage.setItem("lastVisitedLesson", lessonPath);

		goto(lessonPath);
	}

	function handleRecentActivityClick() {
		const lastVisited = localStorage.getItem("lastVisitedLesson");

		if (lastVisited) {
			goto(lastVisited);
		} else {
			alert("ไม่พบหน้าที่เคยเยี่ยมชมล่าสุด");
		}
	}
</script>

<div class="flex flex-col min-h-screen bg-sky-100">
	<div
		class="flex w-full flex-col basis-1/8 justify-center items-center p-4 sm:px-4 md:px-8 lg:px-12 xl:px-16 bg-white sticky top-0 z-20"
	>
		<h2 class="mb-4">เข้าสู่บทเรียน</h2>
		<SearchBar onInput={handleSearchInput} />
		<div
			class="grid grid-cols-3 gap-4 sm:gap-3 md:gap-5 basis-1/7 w-full flex-shrink"
		>
			<div class="col-span-3 bg-blue-500"></div>
			<div
				class="text-responsive flex flex-col justify-center items-center w-full h-full

        bg-blue-200/70 rounded-xl border-blue-900 shadow-lg py-2

        transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			>
				รายการโปรด
			</div>
			<button
				class="text-responsive flex flex-col justify-center items-center w-full h-full

				bg-blue-200/70 rounded-xl border-blue-900 shadow-lg

				transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200 cursor-pointer"
				on:click={handleRecentActivityClick}
			>
				กิจกรรมล่าสุด
			</button>
			<div
				class="text-responsive flex flex-col justify-center items-center w-full h-full
 
        bg-blue-200/70 rounded-xl border-blue-900 shadow-lg
 
        transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-200"
			>
				<button>ไฟล์แบบฝึกหัด</button>
			</div>
		</div>
	</div>
	<div
		class="flex flex-col p-4 sm:px-4 gap-2 md:gap-4 md:px-8 lg:px-12 xl:px-16 flex-1 pb-20 min-h-0 overflow-auto bg-transparent"
	>
		{#each filteredLessons as lesson (lesson.path)}
			<button on:click={() => handleLessonClick(lesson.path)}>
				<LessonCard {lesson} />
			</button>
		{/each}
	</div>
</div>

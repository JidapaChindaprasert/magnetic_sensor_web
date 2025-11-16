<script>
	import { ChevronRight } from 'lucide-svelte';
	export let lesson = { title: 'Default Title', path: '/' }; // Individual lesson data
</script>

<a href={lesson.path} class="flex items-center justify-between w-full h-auto p-4 rounded-2xl border border-blue-900 bg-white hover:bg-blue-50 transition-colors duration-200">
	<p>{lesson.title}</p>
	<ChevronRight class="ml-2" />
</a>
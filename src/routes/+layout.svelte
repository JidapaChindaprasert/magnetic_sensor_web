<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { HouseHeart, FlaskConical, BookOpen, Settings } from 'lucide-svelte';
</script>

{#if !$page.url.pathname.startsWith('/graph')}
	<nav class="fixed z-1 bottom-0 w-full bg-blue-200 p-4 flex justify-around">
		<a href="/"><HouseHeart /></a>
		<a href="/experiment"><FlaskConical /></a>
		<a href="/lesson"><BookOpen /></a>
		<a href="/setting"><Settings /></a>
	</nav>
{/if}

<slot />

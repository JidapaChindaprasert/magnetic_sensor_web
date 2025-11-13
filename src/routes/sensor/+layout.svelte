<script>
	import { X } from "lucide-svelte";
	import { onMount, onDestroy } from 'svelte';

	let hidden = false;
	let lastScroll = 0;
	let ticking = false;

	function handleScroll() {
		const current = window.pageYOffset || document.documentElement.scrollTop;
		if (!ticking) {
			window.requestAnimationFrame(() => {
				if (current > lastScroll && current > 50) {
					hidden = true;
				} else {
					hidden = false;
				}
				lastScroll = current <= 0 ? 0 : current;
				ticking = false;
			});
			ticking = true;
		}
	}

	onMount(() => {
		lastScroll = window.pageYOffset || document.documentElement.scrollTop;
		window.addEventListener('scroll', handleScroll, { passive: true });
	});

	onDestroy(() => {
		window.removeEventListener('scroll', handleScroll);
	});
</script>

<main class="flex flex-col min-h-screen bg-sky-100">
	<!-- fixed nav: hide on scroll down, show on scroll up -->
	<nav class="fixed left-0 right-0 top-0 z-30 bg-white shadow"
		class:translate-y-0={!hidden}
		class:-translate-y-full={hidden}
	>
		<div class="flex h-16 items-center justify-between px-4">
			<h2>การเชื่อมต่อเซนเซอร์</h2>
			<a href="/" class="hover:bg-gray-200 rounded-md p-2">
				<X/>
			</a>
		</div>
	</nav>

	<!-- spacer to prevent content being covered by fixed nav -->
	<div class="h-16" aria-hidden="true"></div>

	<slot />
</main>
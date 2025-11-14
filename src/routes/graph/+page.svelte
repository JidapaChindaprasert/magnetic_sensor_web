<script>
	import { slide } from "svelte/transition";
	import {
		ChevronLeft,
		LineChart,
		ChartSpline,
		ChartColumnBig,
		ChartNetwork,
		EllipsisVertical,
	} from "lucide-svelte";

	import { stats } from "$lib/data.ts";
	import LineGraph from "$lib/components/LineChart.svelte";

	const myData = [
		{ x: 0, y: 2 },
		{ x: 1, y: 4 },
		{ x: 2, y: 3 },
		{ x: 3, y: 5 },
	];

	let isDropdownOpen = false;

	const handleDropdownClick = () => {
		isDropdownOpen = !isDropdownOpen;
	};

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		if (
			relatedTarget instanceof HTMLElement &&
			currentTarget.contains(relatedTarget)
		)
			return;
		isDropdownOpen = false;
	};
</script>

<div class="flex flex-col h-screen bg-stone-100">
	<nav
		class="flex items-center justify-between w-full p-4 bg-white shadow-sm flex-shrink-0"
	>
		<div class="flex items-center gap-2 sm:gap-3">
			<a href="/experiment" class="hover:bg-gray-100 rounded-full p-1 transition">
				<ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
			</a>
			<p class="text-sm sm:text-base font-medium">กราฟแสดงข้อมูล</p>
		</div>
		<div class="flex items-center gap-3 sm:gap-4">
			<div
				class="relative flex flex-col items-center rounded-2xl bg-blue-100 overflow-visible"
				on:focusout={handleDropdownFocusLoss}
			>
				<button
					class="p-2 pr-3 z-10 flex justify-center items-center rounded-2xl bg-blue-100 hover:bg-blue-200 transition"
					on:click={handleDropdownClick}
					aria-label="Chart options"
				>
					<LineChart color="#60A5FA" class="w-5 h-5 sm:w-6 sm:h-6" />
				</button>
				{#if isDropdownOpen}
					<ul
						class="absolute z-20 top-10 right-0 w-40 sm:w-48 bg-blue-100 rounded-2xl shadow-lg flex flex-col gap-1 "
						transition:slide={{ duration: 300 }}
					>
						<li>
							<button class="w-full flex items-center justify-between p-2 pr-3 hover:bg-blue-200 rounded-lg transition text-end text-xs sm:text-sm">
								<span>Curve Fit</span>
								<ChartSpline color="#60A5FA" class="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</li>
						<li>
							<button class="w-full flex items-center justify-between p-2 pr-3 hover:bg-blue-200 rounded-lg transition text-end text-xs sm:text-sm">
								<span>Integral</span>
								<svg
									fill="#60A5FA"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4 sm:w-5 sm:h-5"
								>
									<path
										d="M5,19l.38.76a2.24,2.24,0,0,0,2,1.24h0a2.24,2.24,0,0,0,2.13-1.53L12,12l2.49-7.47A2.24,2.24,0,0,1,16.62,3h0a2.24,2.24,0,0,1,2,1.24L19,5"
										style="fill: none; stroke: #60A5FA; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
									/>
								</svg>
							</button>
						</li>
						<li>
							<button class="w-full flex items-center justify-between p-2 pr-3 hover:bg-blue-200 rounded-lg transition text-end text-xs sm:text-sm">
								<span>Statistics</span>
								<ChartColumnBig color="#60A5FA" class="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</li>
						<li>
							<button class="w-full flex items-center justify-between p-2 pr-3 hover:bg-blue-200 rounded-lg transition text-end text-xs sm:text-sm">
								<span>Interpolation</span>
								<ChartNetwork color="#60A5FA" class="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</li>
					</ul>
				{/if}
			</div>
			<button class="hover:bg-gray-100 rounded-full p-1 transition" aria-label="More options">
				<EllipsisVertical class="w-5 h-5 sm:w-6 sm:h-6" />
			</button>
		</div>
	</nav>
	
	<div class="flex-1 overflow-auto bg-blue-50">
		<div class="h-full w-full flex justify-start items-start">
				<LineGraph {stats} />
		</div>
	</div>
</div>
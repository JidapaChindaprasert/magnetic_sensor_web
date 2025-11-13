<script>
	import { X, Search } from "lucide-svelte";
	export let placeholder = "ค้นหา";
	export let value = "";
	export let onInput = () => {};
	export let onSearch = () => {}; // callback when search button clicked

	const clearInput = () => {
		value = "";
		onInput(value);
	};

	const handleSearch = () => {
		onSearch(value);
	};
</script>

<div
	class="flex items-center bg-white border rounded-2xl border-blue-900 px-3 py-2 shadow-sm w-full"
>
	<input
		type="text"
		bind:value
		{placeholder}
		on:input={(e) => onInput(e.target.value)}
		class="flex-1 outline-none text-gray-700 placeholder-gray-400"
	/>

	{#if value}
		<button
			on:click={clearInput}
			class="ml-2 p-1 rounded hover:bg-gray-200 transition"
			aria-label="Clear search"
		>
			<X class="w-4 h-4 text-red-400" />
		</button>
	{/if}

	<button
		on:click={handleSearch}
		class="ml-2 text-sky-600 px-3 py-1 rounded-2xl flex items-center transition"
	>
		<Search class="w-4 h-4 mr-1" />
	</button>
</div>


<!-- <script>
  import SearchBar from '$lib/components/SearchBar.svelte';
  let query = '';

  const handleInput = (val) => {
    query = val;
  };

  const handleSearch = (val) => {
    console.log('Searching for:', val);
  };
</script>

<div class="p-4">
  <SearchBar
    placeholder="ค้นหาอุปกรณ์..."
    value={query}
    onInput={handleInput}
    onSearch={handleSearch}
  />
  <p class="mt-4">Current query: {query}</p>
</div> -->
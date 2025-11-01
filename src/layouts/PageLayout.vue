<template>
  <div class="grid grid-rows-[auto_1fr] h-full border shadow rounded-md">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2 gap-2"
    >
      <slot name="header"></slot>
    </section>

    <section
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <slot name="content"></slot>
    </section>
  </div>
</template>

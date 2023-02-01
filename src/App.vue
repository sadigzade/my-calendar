<template>
  <div>
    <div class="post" v-for="post in posts" :key="post.id">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
      <p>{{ $store.state.count }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
    };
  },
  async mounted() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const posts = await res.json();
    console.log(posts);
    this.posts = posts;
  },
};
</script>

<style scoped></style>

import { reactive, computed } from 'vue';

export const profileStore = reactive({
  user: null,
  finishedGames: [],
  loading: false,
});

export const wonGames = computed(() => {
  if (!profileStore.user) return [];
  return profileStore.finishedGames.filter(
    (g) => g.winner_name === profileStore.user.name,
  );
});

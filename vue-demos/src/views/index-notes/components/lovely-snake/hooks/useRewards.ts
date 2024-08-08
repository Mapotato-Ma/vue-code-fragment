import { computed, ref } from 'vue';
import type { PointList } from './useSnake';

export enum RewardType {
  小奖励 = 'small',
  大奖励 = 'big'
}

export const useRewards = () => {
  const currentRewardType = ref<RewardType>(RewardType.小奖励);
  const currentReward = ref<PointList>();
  const currentRewardJSON = computed(() => JSON.stringify(currentReward.value));
  const bigRewardRate = 0.5;
  const REWARD_CACHE = [
    ...new Array(100 - 100 * bigRewardRate).fill(0).map(() => RewardType.小奖励),
    ...new Array(100 * bigRewardRate).fill(0).map(() => RewardType.大奖励)
  ];
  const getRewardType = () => {
    return REWARD_CACHE.sort(() => Math.random() - 0.5)[0];
  };

  return { currentRewardType, currentReward, currentRewardJSON, getRewardType };
};

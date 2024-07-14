import type { LPopover } from '@/layout';
export const message: InstanceType<typeof LPopover> = <InstanceType<typeof LPopover>>{};

export const installMessage = (ref: InstanceType<typeof LPopover>) =>
  Object.assign(message, { ...ref });

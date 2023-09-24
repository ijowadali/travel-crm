// import type { PropType } from 'vue';
import { NUpload } from 'naive-ui';

export const basicProps = {
  ...NUpload.props,
  accept: {
    type: String,
    default: '.jpg,.png,.jpeg,.svg,.gif'
  },
  helpText: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 2
  },
  maxNumber: {
    type: Number,
    default: Infinity
  },
  value: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 104
  },
  height: {
    type: Number,
    default: 104
  }
};

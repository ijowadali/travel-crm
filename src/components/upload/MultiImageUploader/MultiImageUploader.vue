<template>
  <div class="w-full">
    <div class="upload">
      <div class="upload-card">
        <div
          class="upload-card-item"
          :style="getCSSProperties"
          v-for="(item, index) in imgList"
          :key="`img_${index}`"
        >
          <div class="upload-card-item-info">
            <div class="img-box">
              <img :src="item" />
            </div>
            <div class="img-box-actions">
              <n-icon size="18" class="mx-2 action-icon" @click="preview(item)">
                <EyeOutlined />
              </n-icon>
              <n-icon size="18" class="mx-2 action-icon" @click="remove(index)">
                <DeleteOutlined />
              </n-icon>
            </div>
          </div>
        </div>

        <div
          class="upload-card-item upload-card-item-select-picture"
          :style="getCSSProperties"
          v-if="imgList.length < maxNumber"
        >
          <n-upload
            v-bind="$props"
            :file-list-style="{ display: 'none' }"
            @before-upload="beforeUpload"
            @finish="finish"
          >
            <div class="flex flex-row justify-center">
              <n-icon size="20" class="m-auto">
                <CloudUpload />
              </n-icon>
              <span class="upload-title pl-2">Images</span>
            </div>
          </n-upload>
        </div>
      </div>
    </div>

    <n-space>
      <n-alert title="hint" type="info" v-if="helpText" class="flex w-full">
        {{ helpText }}
      </n-alert>
    </n-space>
  </div>

  <n-modal
    v-model:show="showModal"
    preset="card"
    title="preview"
    :bordered="false"
    :style="{ width: '520px' }"
  >
    <img :src="previewUrl" alt="Preview Image" />
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, computed, watch } from 'vue';
import { EyeOutlined, DeleteOutlined } from '@vicons/antd';
import { CloudUpload } from '@vicons/tabler';
import { basicProps } from '@src/components/upload/MultiImageUploader/props';
import { useMessage, useDialog } from 'naive-ui';
import { useEnv } from '@src/hooks/useEnv';
import componentSetting from '@src/components/upload/MultiImageUploader/componentSetting';
import { isString } from '@src/components/upload/MultiImageUploader/utils';

export default defineComponent({
  name: 'MultiImageUploader',

  components: { EyeOutlined, DeleteOutlined, CloudUpload },
  props: {
    ...basicProps
  },
  emits: ['uploadChange', 'delete'],
  setup(props, { emit }) {
    const getCSSProperties = computed(() => {
      return {
        width: `${props.width}px`,
        height: `${props.height}px`
      };
    });
    const message = useMessage();
    const dialog = useDialog();
    const state = reactive({
      showModal: false,
      previewUrl: '',
      originalImgList: [] as string[],
      imgList: [] as string[]
    });

    // assign the default image display
    watch(
      () => props.value,
      () => {
        state.imgList = props.value.map((item: any) => {
          return getImgUrl(item.images);
        });
      },
      { immediate: true }
    );

    // preview
    function preview(url: string) {
      state.showModal = true;
      state.previewUrl = url;
    }

    // delete
    function remove(index: number) {
      dialog.info({
        title: 'Prompt',
        content: 'Are you sure you want to delete? ',
        positiveText: 'OK',
        negativeText: 'Cancel',
        onPositiveClick: () => {
          state.imgList.splice(index, 1);
          state.originalImgList.splice(index, 1);
          emit('uploadChange', state.originalImgList);
          emit('delete', state.originalImgList);
        },
        onNegativeClick: () => {}
      });
    }

    // Assemble the complete picture address
    function getImgUrl(url: string): string {
      const { imgUrl } = useEnv();
      return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}${url}`;
    }

    function checkFileType(fileType: string) {
      return componentSetting.upload.fileType.includes(fileType);
    }

    // before uploading
    function beforeUpload({ file }: any) {
      const fileInfo = file.file;
      const { maxSize, accept } = props;
      const acceptRef = (isString(accept) && accept.split(',')) || [];

      // Set the maximum value, then judge
      if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
        message.error(`The maximum upload file size cannot exceed ${maxSize}M`);
        return false;
      }

      // Set the type, then judge
      const fileType = componentSetting.upload.fileType;
      if (acceptRef.length > 0 && !checkFileType(fileInfo.type)) {
        message.error(`Only upload files of type ${fileType.join(',')}`);
        return false;
      }

      return true;
    }

    // upload finished
    // function finish({ event: Event }: any) {
    //   const res = eval('(' + Event.target.response + ')');
    //   const infoField = componentSetting.upload.apiSetting.infoField;
    //   const { code } = res;
    //   const message = res.msg || res.message || 'upload failed';
    //   const result = res[infoField];
    //   // success
    //   if (code === 200) {
    //     let imgUrl: string = getImgUrl(result);
    //     state.imgList.push(imgUrl);
    //     state.originalImgList.push(result);
    //     emit('uploadChange', state.originalImgList);
    //   } else message.error(message);
    // }
    function finish({ event }: any) {
      const response = event.target.response;
      let res;
      try {
        res = JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        return;
      }

      const infoField = componentSetting.upload.apiSetting.infoField;
      const { code } = res;
      const message = res.msg || res.message || 'upload failed';
      const result = res[infoField];

      // success
      if (code === 200) {
        let imgUrl: string = getImgUrl(result);
        state.imgList.push(imgUrl);
        state.originalImgList.push(result);
        emit('uploadChange', state.originalImgList);
      } else {
        console.error(message);
      }
    }

    return {
      ...toRefs(state),
      finish,
      preview,
      remove,
      beforeUpload,
      getCSSProperties
    };
  }
});
</script>

<style lang="scss">
.upload {
  width: 100%;
  overflow: hidden;

  &-card {
    width: auto;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      margin: 0 8px 8px 0;
      position: relative;
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      &:hover {
        background: 0 0;

        .upload-card-item-info::before {
          opacity: 1;
        }

        &-info::before {
          opacity: 1;
        }
      }

      &-info {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0;
        overflow: hidden;

        &:hover {
          .img-box-actions {
            opacity: 1;
          }
        }

        &::before {
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: all 0.3s;
          content: ' ';
        }

        .img-box {
          position: relative;
          border-radius: 2px;
        }

        .img-box-actions {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:hover {
            background: 0 0;
          }

          .action-icon {
            color: rgba(255, 255, 255, 0.85);

            &:hover {
              cursor: pointer;
              color: #fff;
            }
          }
        }
      }
    }

    &-item-select-picture {
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
      background: #fafafa;
      color: #666;

      .upload-title {
        color: #666;
        white-space: nowrap;
      }
    }
  }
}
</style>

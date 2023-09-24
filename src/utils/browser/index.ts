import type { ScrollOptions } from '@src/utils/browser/private';

export class BrowserUtils {
  static setClipBoardText(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }

  static openNewWindow(url: string) {
    const w: Window | null = window.open('about:blank');
    if (w) {
      w.opener = null;
      w.location.href = url;
    }
  }

  static downloadFile(imgURL: string, fileName: string) {
    const aElement = document.createElement('a');
    aElement.href = imgURL;
    aElement.setAttribute('download', fileName);
    aElement.click();
  }

  static isMobileDevice() {
    return window.matchMedia('only screen and (max-width: 640px)').matches;
  }

  static smoothScroll(scrollOptions: ScrollOptions): number | null {
    const startTime = performance.now();
    const start = scrollOptions.element.scrollLeft;
    const distance = scrollOptions.target - start;

    let currentFrameId: number | null = null;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (scrollOptions.duration ?? 200), 1);
      // eslint-disable-next-line no-param-reassign
      scrollOptions.element.scrollLeft = start + distance * progress;

      if (!scrollOptions.animationFrameId) {
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      } else if (progress < 1) {
        currentFrameId = requestAnimationFrame(step);
      } else {
        currentFrameId = null;
      }
    };

    requestAnimationFrame(step);
    return currentFrameId;
  }
}

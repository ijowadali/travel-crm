import type { PageModel } from '@src/types/request';

export class BasePageModel {
  page: number;

  pageSize: number;

  searchText?: string;

  startDate?: string;

  endDate?: string;

  sort?: string;

  order?: string;

  constructor(pageModel?: PageModel) {
    const { page, pageSize, searchText, startDate, endDate, sorters } =
      pageModel ?? {};
    this.page = page ?? 1;
    this.pageSize = pageSize ?? 10;
    if (searchText) {
      this.searchText = searchText;
    }
    if (startDate) {
      this.startDate = startDate;
    }
    if (endDate) {
      this.endDate = endDate;
    }
    if (sorters && Array.isArray(sorters) && sorters.length > 0) {
      const sorterKeys = sorters.map((sorter) => sorter.key);
      this.sort = sorterKeys.join();
      const sorterOrders = sorters.map((sorter) => sorter.order);
      this.order = sorterOrders.join();
    }
  }
}

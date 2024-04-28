export type TableListItem = {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};


export type TableCallVolumeData = {
  hrSpecialArea?: string;
  hrContactPoint?: string;
  hrDate: string | number;
  hrChains: string | number;
  hrRemarks?: string;
}

export type TableSatisfactionData = {
  mydChannel?: string;
  mydContactPoint?: string;
  mydDate: string | number;
  mydChains: string | number;
  mydRemarks: string;
}

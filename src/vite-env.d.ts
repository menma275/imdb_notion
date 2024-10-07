type IMDbInfo = {
  title: string | null;
  director: string | null;
  tags: string[] | null;
  country: string | null;
  isTVSeries: boolean | null;
  imageLink: string | null;
};

type Datas = {
  imdbInfo: IMDbInfo;
  rating: number | null;
  comment: string | null;
  watchedOn: WatchedOn | null;
};

type WatchedOn = "Netflix" | "Prime Video" | "Theater" | null;

export { IMDbInfo, Datas, WatchedOn };

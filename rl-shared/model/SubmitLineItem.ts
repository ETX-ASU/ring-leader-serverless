class SubmitLineItem {
  scoreMaximum: number | undefined;
  label: string | undefined;
  resourceId: string | undefined;
  tag: string | undefined;

  constructor(data: Partial<SubmitLineItem> | undefined | null) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.scoreMaximum = 100;
      this.label = "Title";
      this.resourceId = "tool-assignment-xyz";
      this.tag = "etag";
    }
  }
}

export default SubmitLineItem;

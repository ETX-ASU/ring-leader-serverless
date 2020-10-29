import SubmitLineItem from "./SubmitLineItem"

class SubmitContentItem {
  type: string | undefined;
  title: string | undefined;
  url: string | undefined; //"/assignment?resourceId=tool-assignment-xyz";
  resourceId: string | undefined;
  lineItem: SubmitLineItem | undefined;

  constructor(data: Partial<SubmitContentItem> | undefined | null) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.type = "ltiResourceLink";
      this.title = "Title";
      this.url = "/assignment?resourceId=tool-assignment-xyz";
      this.resourceId = "tool-assignment-xyz";
      this.lineItem = new SubmitLineItem(null);
    }
  }
}

export default SubmitContentItem;
export interface ToolHandler {
    name: string;
    onCall(args: any): Promise<any>;
    describe(): any;
  }
  
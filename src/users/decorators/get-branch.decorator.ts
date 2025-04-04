import { createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GetBranch = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const branch = req.branchId;
    return branch ? branch : branch[data];
  }
);
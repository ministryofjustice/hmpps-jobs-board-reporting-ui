/* eslint-disable @typescript-eslint/no-explicit-any */
const expressMocks = () => ({
  req: {
    session: {
      data: {},
    },
    context: {},
    params: {},
    query: {},
    body: {},
  } as any,
  res: {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn().mockReturnThis(),
    locals: {},
  } as any,
  next: jest.fn(),
})

export default expressMocks

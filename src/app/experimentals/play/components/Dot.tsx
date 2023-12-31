'use client';

// import tw, { styled } from 'twin.macro';

// export const _Dot = styled.div(() => [
//   tw`absolute z-[30] top-[50%] left-[50%] translate-x-[-50%] translate-y-[50%]`,
//   tw`w-[10px] h-[10px] rounded border-white border-2`,
// ]);

const Dot = () => (
  <div className="absolute z-[30] top-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] w-[10px] h-[10px] rounded border-white border-2" />
);

export default Dot;

interface SkillChipProps {
  name: string;
}

export const SkillChip = ({ name }: SkillChipProps) => {
  return (
    <div className="w-fit h-fit bg-slate-200 text-black whitespace-nowrap dark:bg-slate-400 font-bold px-2 py-0.5 rounded-full text-center flex items-center ">
      {name}
    </div>
  );
};

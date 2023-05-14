import React from "react";

type InputProps = {
  placeholder: string;
  onSubmit?: (event: React.FormEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => {
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      props?.onSubmit && props?.onSubmit(event);
    }
  }

  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      onKeyDown={handleKeyDown}
      className="w-full rounded-none border-2 border-slate-400 bg-zinc-900 px-4 py-2 text-lg text-blue-500 outline-none focus:bg-zinc-800"
    />
  );
};

export default Input;

const FormInput = ({
  label,
  id,
  error,
  icon: Icon,
  className = "",
  textarea = false,
  ...props
}) => {
  const inputClass = `input ${error ? "input-error" : ""} ${Icon ? "pl-10" : ""} ${className}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        {textarea ? (
          <textarea id={id} rows={4} className={inputClass} {...props} />
        ) : (
          <input id={id} className={inputClass} {...props} />
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default FormInput;

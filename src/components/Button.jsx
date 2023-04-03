function Button(props) {
  return (
    <button class="p-2 rounded-full items-center w-12 h-12" onClick={() => props.onClick()}>
      <div class="w-full h-full flex justify-center items-center">{props.children}</div>
    </button>
  );
}

export default Button;

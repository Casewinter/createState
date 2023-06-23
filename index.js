let memory = new Map();

const defaultGetter = (signature) => () => memory.get(signature);
const defaultSetter = (signature) => (data) => memory.set(signature, data);

const createState = (init) => {
  const signature = memory.size;
  memory.set(signature, init);
  const getter = defaultGetter(signature);
  const set = defaultSetter(signature);

  const setter = (newValue) => {
    return set(newValue);
  };
  return [getter, setter];
};

const createBoolean = (init, condition) => {
  const signature = memory.size;
  memory.set(signature, init);
  const getter = defaultGetter(signature);
  const set = defaultSetter(signature);

  const setter = (newValue) => {
    switch (newValue) {
      case condition[0]:
        set(true);
        break;
      case condition[1]:
        set(false);
        break;
      default:
        console.error(`Sorry, something wrong`);
        set(false);
    }
  };
  return [getter, setter];
};

const createArray = (init) => {
  const signature = memory.size;
  const get = defaultGetter(signature);
  const set = defaultSetter(signature);

  Array.isArray(init)
    ? memory.set(signature, init)
    : memory.set(signature, [init]);

  const getter = (index) => {
    if (typeof index == "number") {
      return get()[index];
    }
    return get();
  };

  const setter = (index, newValue) => {
    if (newValue !== undefined && !Array.isArray(index)) {
      const newArr = [];
      newArr[0] = index;
      set(newArr);
    } else if (Array.isArray(index)) {
      set(index);
    } else {
      const arr = get();
      arr[index] = newValue;
      set(arr);
    }
  };
  return [getter, setter];
};

const useMutating = (mutateMethod, currentValue, setterFn, newValue) => {
  switch (mutateMethod) {
    case "push":
      setterFn([...currentValue(), ...newValue]);
      break;
    case "pop":
      setterFn(currentValue().slice(0, -1));
      break;
    case "reverse":
      const reversed = currentValue().reverse();
      setterFn(reversed);
      break;
    case "shift":
      setterFn(currentValue().slice(1));
      break;
    case "sort":
      setterFn(currentValue().sort());
      break;
    default:
      console.error(`Sorry, something wrong`);
  }
};


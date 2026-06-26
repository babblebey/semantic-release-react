export function parseRuntimeOptions(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const raw = token.slice(2);
    const separatorIndex = raw.indexOf("=");
    const hasInlineValue = separatorIndex >= 0;
    const rawKey = hasInlineValue ? raw.slice(0, separatorIndex) : raw;
    const inlineValue = hasInlineValue ? raw.slice(separatorIndex + 1) : undefined;

    if (!rawKey) {
      continue;
    }

    if (rawKey.startsWith("no-")) {
      const key = toCamelCase(rawKey.slice(3));
      assignOption(options, key, false);
      if (key === "ci") {
        assignOption(options, "noCi", true);
      }
      continue;
    }

    const key = toCamelCase(rawKey);
    if (inlineValue !== undefined) {
      assignOption(options, key, parseValue(inlineValue));
      continue;
    }

    const nextToken = argv[index + 1];
    if (nextToken && !nextToken.startsWith("--")) {
      assignOption(options, key, parseValue(nextToken));
      index += 1;
      continue;
    }

    assignOption(options, key, true);
  }

  return options;
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function parseValue(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return value;
}

function assignOption(options, key, value) {
  if (!(key in options)) {
    options[key] = value;
    return;
  }

  const currentValue = options[key];
  if (Array.isArray(currentValue)) {
    currentValue.push(value);
    return;
  }

  options[key] = [currentValue, value];
}
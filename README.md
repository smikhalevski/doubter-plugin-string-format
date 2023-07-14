# @doubter/plugin-string-format

String format validation [plugin for Doubter.](https://github.com/smikhalevski/doubter)

```shell
npm install --save-prod doubter @doubter/plugin-string-format
```

# How to use?

Import and enable the plugin:

```ts
import * as d from 'doubter';
import enableStringFormat from '@doubter/plugin-string-format';

enableStringFormat(d.StringShape.prototype);

const emailShape = d.string().email();

emailShape.parse('foo@bar.com');
// ⮕ 'foo@bar.com'

emailShape.parse('foo');
// ❌ ValidationError: string.format at /: Must be an email
```

Cherry-pick separate format checkers:

```ts
import * as d from 'doubter';
// 🟡 Import a single format module
import enableBICFormat from '@doubter/plugin-string-format/bic';

enableBICFormat(d.StringShape.prototype);

const bicShape = d.string().bic();

bicShape.parse('BOFAUS3N');
// ⮕ 'BOFAUS3N'

bicShape.parse('QUX');
// ❌ ValidationError: string.format at /: Must be a BIC or SWIFT code
```

# Validation issues

Format checks raise issues with `"string.format"` code.

```ts
d.string().email().try('foo');
```

The code above would return an `Err` result:

```json5
{
  ok: false,
  issues: [
    {
      code: 'string.format',
      input: 'foo',
      message: 'Must be an email',
      param: {
        format: 'email',
        allowDisplayName: false,
        allowIPDomain: false,
        allowUTF8LocalPart: true,
        blacklistedChars: '',
        hostBlacklist: [],
        hostWhitelist: [],
        ignoreMaxLength: false,
        requireDisplayName: false,
        requireTLD: true,
      },
    },
  ],
}
```

Use `.issues[].param.format` to detect the exact format that was violated.

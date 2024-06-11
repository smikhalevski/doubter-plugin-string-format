# @doubter/plugin-string-format

String format validation [plugin for Doubter](https://github.com/smikhalevski/doubter).

- ASCII
- BIC
- Email
- Fully qualified domain name
- IMEI number
- IP
- ISIN
- Luhn algorithm
- MIME type
- UUID

```shell
npm install --save-prod doubter @doubter/plugin-string-format
```

🔎 [Check out the API Docs](https://smikhalevski.github.io/doubter-plugin-string-format)

# How to use?

Import and enable the plugin:

```ts
import * as d from 'doubter';
import enableStringFormat from '@doubter/plugin-string-format';

enableStringFormat(d.StringShape);

const emailShape = d.string().email();

emailShape.parse('foo@bar.com');
// ⮕ 'foo@bar.com'

emailShape.parse('foo');
// ❌ ValidationError: string.format.email at /: Must be an email
```

Or cherry-pick separate format checkers:

```ts
import * as d from 'doubter';
// 🟡 Import a single format module
import enableBICFormat from '@doubter/plugin-string-format/bic';

enableBICFormat(d.StringShape);

const bicShape = d.string().bic();

bicShape.parse('BOFAUS3N');
// ⮕ 'BOFAUS3N'

bicShape.parse('QUX');
// ❌ ValidationError: string.format.bic at /: Must be a BIC or SWIFT code
```

In some cases `enableStringFormat` call may be tree shaken by a bundler.
Add [`/*@__NOINLINE__*/`](https://terser.org/docs/miscellaneous/#annotations) annotation to prevent this behaviour:

```ts
/*@__NOINLINE__*/ enableStringForma(d.StringShape);
```

# Validation issues

Format checks raise issues with [`"string.format.*"`](./src/main/constants.ts) code.

```ts
d.string().email().try('foo');
```

The code above would return an `Err` result:

```json5
{
  ok: false,
  issues: [
    {
      code: 'string.format.email',
      input: 'foo',
      message: 'Must be an email',
      param: {
        allowDisplayName: false,
        allowIPDomain: false,
        allowUTF8LocalPart: true,
        blacklistedChars: '',
        hostBlacklist: [],
        hostWhitelist: [],
        ignoreMaxLength: false,
        requireDisplayName: false,
        requireTLD: true
      }
    }
  ]
}
```

# Localization

Provide [`messages`](https://smikhalevski.github.io/doubter/latest/interfaces/core.ParseOptions.html#messages) option
to parsing methods:

```ts
const emailShape = d.string().email();

emailShape.parse('foo', {
  messages: {
    'string.format.email': 'Invalid email'
  }
});
// ❌ ValidationError: string.format.email at /: Invalid email
```

Or pass a message directly to a plugin method:

```ts
d.string().email('Not an email').parse('foo');
// ❌ ValidationError: string.format.email at /: Not an email
```

More details in the [Localization](https://github.com/smikhalevski/doubter?tab=readme-ov-file#localization) section of
Doubter docs.

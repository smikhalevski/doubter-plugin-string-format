# @doubter/plugin-string-format

String format validation [plugin for Doubter.](https://github.com/smikhalevski/doubter)

```shell
npm install --save-prod doubter @doubter/plugin-string-format
```

How to enable the plugin:

```ts
import * as d from 'doubter';
import enableStringFormat from '@doubter/plugin-string-format';

enableStringFormat(d.StringShape.prototype);

const emailShape = d.string().email();

emailShape.parse('foo@bar.com');
// ⮕ 'foo@bar.com'

emailShape.parse('Bill');
// ❌ ValidationError: string_format at /: Must be an email
```

Or cherry-pick separate format checkers:

```ts
import * as d from 'doubter';
// 🟡 Import a single format module
import enableBICFormat from '@doubter/plugin-string-format/bic';

enableBICFormat(d.StringShape.prototype);

const bicShape = d.string().bic();

bicShape.parse('BOFAUS3N');
// ⮕ 'BOFAUS3N'

bicShape.parse('Gary');
// ❌ ValidationError: string_format at /: Must be a BIC or SWIFT code
```

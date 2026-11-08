# Fonts

Ateria loads its fonts from this folder, so opening the site sends no request to any font service.

| File | Family | Used for | Licence |
| --- | --- | --- | --- |
| `ateria-serif.woff` | Lora (variable, weight 400–700), subset and renamed "Ateria Serif" | Headlines, dish names, big numbers | SIL Open Font License 1.1 |
| `ateria-sans-400.woff`, `-600`, `-700` | Inter (Regular, SemiBold, Bold), subset | Body text, buttons, labels, tables | SIL Open Font License 1.1 |

* Lora: Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora".
* Inter: Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter).
* Licence text and FAQ: https://openfontlicense.org

The files are subsets (Basic Latin, Latin-1, Latin Extended A and B, combining marks, Vietnamese, common punctuation and symbols), so every letter of English, Finnish, Swedish and Vietnamese is covered. Because Lora has a Reserved Font Name, the subset carries a different family name. To rebuild them, run `pyftsubset` from fontTools on the original font files with `--flavor=woff`.

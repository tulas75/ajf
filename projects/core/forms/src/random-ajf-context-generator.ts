/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Advanced JSON forms (ajf).
 *
 * Advanced JSON forms (ajf) is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Advanced JSON forms (ajf) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Advanced JSON forms (ajf).
 * If not, see http://www.gnu.org/licenses/.
 *
 */

import {AjfContext} from '@ajf/core/common';
import {deepCopy} from '@ajf/core/utils';
import {AjfField} from './interface/fields/field';
import {AjfFieldType} from './interface/fields/field-type';
import {AjfContainerNode} from './interface/nodes/container-node';
import {AjfNode} from './interface/nodes/node';
import {AjfFormSerializer} from './serializers/form-serializer';
import {AjfFormCreate} from './utils/forms/create-form';
import {isField} from './utils/nodes/is-field';
import {isRepeatingSlide} from './utils/nodes/is-repeating-slide';

function generateRandomInstanceFields(fields: AjfField[]): AjfField[] {
  const fieldReps: AjfField[] = [];
  fields.forEach(f => {
    for (let i = 0; i < 5; i++) {
      const newReps = deepCopy(f);
      newReps.name = `${newReps.name}__${i}`;
      fieldReps.push(newReps);
    }
  });
  return fieldReps;
}

function flattenFields(slides: AjfNode[]): AjfField[] {
  let flatFields: AjfField[] = [];
  slides.forEach(slide => {
    if (isField(slide)) {
      flatFields.push(slide);
    } else if (isRepeatingSlide(slide)) {
      const childs = generateRandomInstanceFields(slide.nodes as AjfField[]);
      flatFields = flatFields.concat(flattenFields(childs));
    } else {
      flatFields = flatFields.concat([...((slide as AjfContainerNode).nodes as AjfField[])]);
    }
  });
  return flatFields;
}

export function generateRandomCtx(formSchema: AjfFormCreate): AjfContext[] {
  const ctxMap: AjfContext[] = [];
  const allFields: AjfField[] = flattenFields(formSchema.nodes!);
  const generateRandomNumberOfContext = Math.floor(Math.random() * 100) + 1;
  for (let i = 0; i < generateRandomNumberOfContext; i++) {
    const ctx: AjfContext = {};
    allFields.forEach(field => {
      switch (field.fieldType) {
        default:
          ctx[field.name] = 0;
          break;
        case AjfFieldType.Formula:
          let formula: string | undefined = field.formula?.formula;
          if (formula != null) {
            const fieldNamesInFormula = allFields
              .map(f => f.name)
              .filter(fname => formula!.includes(fname));
            for (let fieldName of fieldNamesInFormula) {
              if (ctx[fieldName] != null) {
                formula = formula.replace(fieldName, ctx[fieldName]);
              }
            }
            try {
              ctx[field.name] = eval(formula);
            } catch (err) {
              console.log(err);
              ctx[field.name] = NaN;
            }
          } else {
            ctx[field.name] = NaN;
          }
          break;
        case AjfFieldType.Number:
          ctx[field.name] = Math.floor(Math.random() * 1000) + 1;
          break;
        case AjfFieldType.Boolean:
          ctx[field.name] = Math.random() < 0.5;
          break;
        case AjfFieldType.SingleChoice:
          const singleChoices = field.choicesOrigin.choices.map(c => c.value);
          ctx[field.name] = singleChoices[Math.floor(Math.random() * singleChoices.length)];
          break;
        case AjfFieldType.MultipleChoice:
          const multipleChoices = field.choicesOrigin.choices.map(c => c.value);
          ctx[field.name] = [multipleChoices[Math.floor(Math.random() * 35)]];
          break;
        case AjfFieldType.Range:
          const end = field.end ?? 10;
          const start = field.start ?? 1;
          const value = Math.floor(start + Math.random() * (end + 1 - start));
          ctx[field.name] = value;
      }
    });
    ctxMap.push(ctx);
  }
  return ctxMap;
}

export function buildformDatas(formSchemas: {[name: string]: AjfFormCreate}): {
  [name: string]: AjfContext[];
} {
  const forms: {[name: string]: AjfContext[]} = {};
  Object.keys(formSchemas).forEach(nameSchema => {
    forms[nameSchema] = generateRandomCtx(AjfFormSerializer.fromJson(formSchemas[nameSchema]));
  });
  return forms;
}

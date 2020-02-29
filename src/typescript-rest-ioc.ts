import { Container } from 'typescript-ioc';
import * as _ from 'lodash';
import * as debug from 'debug';

const serverDebugger = debug('typescript-rest-ioc');

export default {
    create: (serviceClass: any) => {
        return Container.get(serviceClass);
    },

    getTargetClass: (serviceClass: Function) => {
        if (_.isArray(serviceClass)) {
            return null;
        }
        let typeConstructor: any = serviceClass;
        if (typeConstructor['name'] && typeConstructor['name'] !== 'ioc_wrapper') {
            return typeConstructor as FunctionConstructor;
        }
        typeConstructor = typeConstructor['__parent'];
        while (typeConstructor) {
            if (typeConstructor['name'] && typeConstructor['name'] !== 'ioc_wrapper') {
                return typeConstructor as FunctionConstructor;
            }
            typeConstructor = typeConstructor['__parent'];
        }
        serverDebugger('Can not identify the base Type for requested target: %o', serviceClass);
        throw new TypeError('Can not identify the base Type for requested target');
    }
};
import { SortDirection } from '../base/enum';
/**
 * AriaService

 */
export declare class AriaService {
    setOptions(target: HTMLElement, options: IAriaOptions<boolean>): void;
    setExpand(target: HTMLElement, expand: boolean): void;
    setSort(target: HTMLElement, direction?: SortDirection | 'none' | boolean): void;
    setBusy(target: HTMLElement, isBusy: boolean): void;
    setGrabbed(target: HTMLElement, isGrabbed: boolean, remove?: boolean): void;
    setDropTarget(target: HTMLElement, isTarget: boolean): void;
}
/**

 */
export interface IAriaOptions<T> {
    role?: string;
    expand?: T;
    collapse?: T;
    selected?: T;
    multiselectable?: T;
    sort?: T | 'none';
    busy?: T;
    invalid?: T;
    grabbed?: T;
    dropeffect?: T;
    haspopup?: T;
    level?: T;
    colcount?: string;
}

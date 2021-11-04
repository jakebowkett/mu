
/* 
Definitions for types that are not specific to one component.
*/

type TOnSelect    = (id: string | null, suppressHistory?: boolean) => void;
type TSetOffPc    = (n: number)  => void;
type TSetOffEnd   = (b: boolean) => void;
type TSetFileId   = (id: string | undefined) => void;
type TSetFileData = (id: string | undefined) => void;

export {
    TOnSelect,
    TSetOffPc,
    TSetOffEnd,
    TSetFileId,
    TSetFileData,
};
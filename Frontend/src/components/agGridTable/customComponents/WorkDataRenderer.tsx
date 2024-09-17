/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { ICellRendererParams } from 'ag-grid-community';

const WorkDataRenderer = (props: ICellRendererParams) => {
  const { user, piecesCut, piecesTailored } = props.data;
  // Check the user's role
  const isCutter = user?.role === 'Cutter';
  const isTailor = user?.role === 'Tailor';

  return (
    <div>
      {isCutter && (
        <div>
          <div className='font-weight-bold'>Pieces Cut:</div>
          <div>
            {piecesCut.map((piece: any, index) => {
              return (
                <div className='font-weight-bold' key={index}>
                  {piece.itemType}: {piece.count}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isTailor && (
        <div>
          <div className='font-weight-bold'>Pieces Tailored:</div>
          <div>
            {piecesTailored.map((piece: any, index) => {
              return (
                <div className='font-weight-bold' key={index}>
                  {piece.itemType}: {piece.count}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isCutter && !isTailor && <p>N/A</p>}
    </div>
  );
};

export default WorkDataRenderer;

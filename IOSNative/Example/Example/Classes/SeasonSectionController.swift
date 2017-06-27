//
//  SeasonSectionController.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import UIKit

import IGListKit

final class SeasonSectionController: ListSectionController {
    var parent: UIViewController!
    private var object: SeasonItem?
    
    override func sizeForItem(at index: Int) -> CGSize {
        return CGSize(width: collectionContext!.containerSize.width, height: 55)
    }
    
    override func cellForItem(at index: Int) -> UICollectionViewCell {
        guard let cell = collectionContext?.dequeueReusableCell(of: LabelCell.self, for: self, at: index) as? LabelCell else {
            fatalError()
        }
        cell.text = object?.season
        cell.contentView.backgroundColor = .clear
        cell.textColor = .black
        return cell
    }
    
    override func didUpdate(to object: Any) {
        self.object = object as? SeasonItem
    }
    
    override func didSelectItem(at index: Int) {
        if let controller = mainBoard.instantiateViewController(withIdentifier: "PlayerListViewController") as? PlayerListViewController {
            controller.object = object
            parent.navigationController?.pushViewController(controller, animated: true)
        }
    }
}

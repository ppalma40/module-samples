//
//  ViewController.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import UIKit
import IGListKit

class ViewController: UIViewController {
    var data = [SeasonItem]() {
        didSet {
            self.adapter.reloadData(completion: nil)
        }
    }
    @IBOutlet weak var collectionView: UICollectionView!
    lazy var adapter: ListAdapter = {
        return ListAdapter(updater: ListAdapterUpdater(), viewController: self)
    }()
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        adapter.collectionView = collectionView
        adapter.dataSource = self
        let barbutton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(PlayerListViewController.callRefresh))
        self.navigationItem.rightBarButtonItem = barbutton
        callWebserviceSeason()
    }
    func callRefresh() {
        callWebserviceSeason()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

extension ViewController: ListAdapterDataSource {
    // MARK: ListAdapterDataSource
    
    func objects(for listAdapter: ListAdapter) -> [ListDiffable] {
        return data as [ListDiffable]
    }
    
    func listAdapter(_ listAdapter: ListAdapter, sectionControllerFor object: Any) -> ListSectionController {
        let section = SeasonSectionController()
        section.parent = self
        return section
    }
    
    func emptyView(for listAdapter: ListAdapter) -> UIView? {
        return nil
    }
}
